// server/controllers/aiController.js
const OpenAI = require('openai');
require('dotenv').config(); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to format quiz questions from OpenAI response
function formatQuizData(rawQuizData) {
  try {
      
    const questions = rawQuizData.split(/(\d+\. )/).filter(Boolean); 

    const formattedQuiz = [];
    for (let i = 0; i < questions.length; i += 2) {
      const questionText = questions[i].trim();
      const questionData = questions[i+1]?.trim() || "";

      let answer = "";
      let options = [];

      
        const answerMatch = questionData.match(/Answer: (.+)/);
        if (answerMatch) {
            answer = answerMatch[1].trim();
        }

        const optionsMatch = questionData.match(/[A-D]\. [^\n]+/g);
        if (optionsMatch) {
            options = optionsMatch.map(option => option.substring(3).trim());
        }


      formattedQuiz.push({
        question: questionText,
        answer: answer,
        options: options,
      });
    }
    return formattedQuiz;
  } catch (error) {
    console.error("Error formatting quiz data: ", error);
    return { error: "Failed to format quiz data.  Raw data: " + rawQuizData }; 
  }
}




exports.generateQuiz = async (req, res) => {
  const { topic, numQuestions, difficulty } = req.body;

  if (!topic || !numQuestions || !difficulty) {
    return res.status(400).json({ msg: 'Please provide topic, numQuestions, and difficulty' });
  }

  if (numQuestions > 20) {
    return res.status(400).json({ msg: 'Number of questions cannot exceed 20' }); //Set a reasonable limit
  }

  const prompt = `Generate ${numQuestions} ${difficulty} difficulty quiz questions about ${topic}.  
  Format each question as follows:

  1.  [Question Text]
  Answer: [Correct Answer]
  A. [Option A]
  B. [Option B]
  C. [Option C]
  D. [Option D]

  `; 

  try {
    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct', 
      prompt: prompt,
      max_tokens: 800, 
    });

    const rawQuizData = completion.choices[0].text.trim();
    const formattedQuiz = formatQuizData(rawQuizData);  

    if (formattedQuiz.error) {
      return res.status(500).json({
        msg: "Quiz generation failed",
        error: formattedQuiz.error,
        raw: rawQuizData
      });
    }
    res.json(formattedQuiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ msg: 'Error generating quiz', error: error.message });
  }
};


exports.summarizeText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ msg: 'Please provide the text to summarize' });
  }

  const prompt = `Summarize the following text:\n\n${text}\n\nSummary:`;

  try {
    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: prompt,
      max_tokens: 300,  
    });

    const summary = completion.choices[0].text.trim();
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing text:', error);
    res.status(500).json({ msg: 'Error summarizing text', error: error.message });
  }
};
