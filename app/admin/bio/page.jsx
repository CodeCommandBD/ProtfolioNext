'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUpload, FiSave } from 'react-icons/fi';

const Container = styled.div`
  max-width: 900px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #f2f3f4;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #b1b2b3;
  margin-bottom: 32px;
`;

const Form = styled.form`
  background: #0f0f14;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 32px;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #f2f3f4;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #f2f3f4;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #854ce6;
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: #b1b2b3;
  }
`;

const Textarea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #f2f3f4;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #854ce6;
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: #b1b2b3;
  }
`;

const ErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 14px;
`;

const RolesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RoleInputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const AddButton = styled.button`
  background: rgba(133, 76, 230, 0.1);
  border: 1px solid rgba(133, 76, 230, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: #854ce6;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(133, 76, 230, 0.2);
  }
`;

const RemoveButton = styled.button`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: #ff6b6b;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #854ce6;
    background: rgba(133, 76, 230, 0.05);
  }
`;

const ImagePreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 16px;
  border: 3px solid #854ce6;
`;

const SubmitButton = styled.button`
  background: linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(133, 76, 230, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 20px;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #10b981;
  font-size: 14px;
  margin-bottom: 16px;
`;

const bioSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  insta: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  facebook: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  resume: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// Type removed for .jsx compatibility

export default function BioManagementPage() {
  const [roles, setRoles] = useState(['']);
  const [profileImage, setProfileImage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(bioSchema),
  });

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const response = await fetch('/api/bio');
        const data = await response.json();
        
        if (data) {
          reset(data);
          setRoles(data.roles || ['']);
          setProfileImage(data.profileImage || '');
          setResumeUrl(data.resume || '');
        }
      } catch (error) {
        console.error('Error fetching bio:', error);
      }
    };

    fetchBio();
  }, [reset]);

  const handleImageUpload = async (e: React.ChangeEvent) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'portfolio/profile');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setProfileImage(data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/admin/resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.resumeUrl) {
        setResumeUrl(data.resumeUrl);
        alert('Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!confirm('Are you sure you want to delete the resume?')) return;

    try {
      const response = await fetch('/api/admin/resume', {
        method: 'DELETE',
      });

      if (response.ok) {
        setResumeUrl('');
        alert('Resume deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    }
  };

  const addRole = () => {
    setRoles([...roles, '']);
  };

  const removeRole = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const updateRole = (index, value) => {
    const newRoles = [...roles];
    newRoles[index] = value;
    setRoles(newRoles);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/bio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          roles: roles.filter((r) => r.trim() !== ''),
          profileImage,
          resume: resumeUrl,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Failed to update bio');
      }
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Failed to update bio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
      Bio / Profile Management</Title>
      Manage your personal information and social links</Subtitle>

      {success && ✓ Profile updated successfully!</SuccessMessage>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        
          {/* Profile Image */}
          
            Profile Image</Label>
            <ImageUploadArea onClick={() => document.getElementById('profile-image')?.click()}>
              {profileImage ? (
                <ImagePreview src={profileImage} alt="Profile" />
              ) : (
                
                  <FiUpload size={32} color="#854ce6" style={{ margin: '0 auto 8px' }} />
                  <p style={{ color: '#b1b2b3' }}>
                    {isUploading ? 'Uploading...' : 'Click to upload profile image'}
                  </p>
                </div>
              )}
            </ImageUploadArea>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </FormGroup>

          {/* Name */}
          
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="John Doe" {...register('name')} />
            {errors.name && {errors.name.message}</ErrorMessage>}
          </FormGroup>

          {/* Roles */}
          
            Roles / Titles</Label>
            
              {roles.map((role, index) => (
                <RoleInputGroup key={index}>
                  <Input
                    placeholder="e.g., Front-End Developer"
                    value={role}
                    onChange={(e) => updateRole(index, e.target.value)}
                  />
                  {roles.length > 1 && (
                    <RemoveButton type="button" onClick={() => removeRole(index)}>
                      Remove
                    </RemoveButton>
                  )}
                </RoleInputGroup>
              ))}
              <AddButton type="button" onClick={addRole}>
                + Add Role
              </AddButton>
            </RolesContainer>
          </FormGroup>

          {/* Description */}
          
            <Label htmlFor="description">About / Description *</Label>
            <Textarea
              id="description"
              placeholder="Tell us about yourself..."
              {...register('description')}
            />
            {errors.description && {errors.description.message}</ErrorMessage>}
          </FormGroup>

          {/* Social Links */}
          
            <Label htmlFor="github">GitHub URL</Label>
            <Input id="github" placeholder="https://github.com/username" {...register('github')} />
            {errors.github && {errors.github.message}</ErrorMessage>}
          </FormGroup>

          
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/username"
              {...register('linkedin')}
            />
            {errors.linkedin && {errors.linkedin.message}</ErrorMessage>}
          </FormGroup>

          
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input id="twitter" placeholder="https://twitter.com/username" {...register('twitter')} />
            {errors.twitter && {errors.twitter.message}</ErrorMessage>}
          </FormGroup>

          
            <Label htmlFor="insta">Instagram URL</Label>
            <Input
              id="insta"
              placeholder="https://instagram.com/username"
              {...register('insta')}
            />
            {errors.insta && {errors.insta.message}</ErrorMessage>}
          </FormGroup>

          
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              placeholder="https://facebook.com/username"
              {...register('facebook')}
            />
            {errors.facebook && {errors.facebook.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Resume / CV (PDF)</Label>
            {resumeUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ 
                  background: 'rgba(133, 76, 230, 0.1)', 
                  border: '1px solid rgba(133, 76, 230, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ color: '#f2f3f4', marginBottom: '4px', fontWeight: '500' }}>Current Resume</p>
                    <a 
                      href={resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#854ce6', fontSize: '14px' }}
                    >
                      View / Download Resume
                    </a>
                  </div>
                  <RemoveButton type="button" onClick={handleResumeDelete}>
                    Delete
                  </RemoveButton>
                </div>
              </div>
            ) : (
              <ImageUploadArea onClick={() => document.getElementById('resume-file')?.click()}>
                <FiUpload size={32} color="#854ce6" style={{ margin: '0 auto 8px' }} />
                <p style={{ color: '#b1b2b3' }}>
                  {isUploadingResume ? 'Uploading...' : 'Click to upload resume (PDF only)'}
                </p>
              </ImageUploadArea>
            )}
            <input
              id="resume-file"
              type="file"
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={handleResumeUpload}
              disabled={isUploadingResume}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            <FiSave />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </SubmitButton>
        </FormGrid>
      </Form>
    </Container>
  );
}

