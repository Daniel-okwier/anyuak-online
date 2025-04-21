import React, { useState } from 'react';
import {
  SettingsContainer,
  SettingsTitle,
  InputGroup,
  Label,
  Input,
  TextArea,
  SaveButton,
  SuccessMessage,
  ErrorMessage,
} from './Settings.styles'; 

function SettingsPage() {
  const [name, setName] = useState('Current User Name'); // Replace with actual user data
  const [bio, setBio] = useState('Current user bio goes here.'); // Replace with actual user data
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSave = () => {
    // In a real application, you would send the 'name' and 'bio'
    // to your backend to update the user's information.
    // For now, let's simulate a successful save.
    console.log('Saving:', { name, bio });
    setSaveStatus('success');
    setTimeout(() => {
      setSaveStatus(null);
    }, 2000); // Clear success message after 2 seconds

    // In a real error scenario:
    // setSaveStatus('error');
    // setTimeout(() => {
    //   setSaveStatus(null);
    // }, 3000); // Clear error message after 3 seconds
  };

  return (
    <SettingsContainer>
      <SettingsTitle>Cosmic Profile Settings</SettingsTitle>

      <InputGroup>
        <Label htmlFor="name">Name:</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="bio">Bio:</Label>
        <TextArea
          id="bio"
          value={bio}
          onChange={handleBioChange}
        />
      </InputGroup>

      <SaveButton onClick={handleSave}>Save Changes</SaveButton>

      {saveStatus === 'success' && <SuccessMessage>Profile updated successfully!</SuccessMessage>}
      {saveStatus === 'error' && <ErrorMessage>Failed to update profile. Please try again.</ErrorMessage>}
    </SettingsContainer>
  );
}

export default SettingsPage;