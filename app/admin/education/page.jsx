'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiUpload } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Reuse styled components
const Container = styled.div`max-width: 1200px;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;`;
const Title = styled.h1`font-size: 32px; font-weight: 700; color: #f2f3f4;`;
const AddButton = styled.button`background: linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%); border: none; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; color: white; cursor: pointer; display: flex; align-items: center; gap: 8px; &:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(133, 76, 230, 0.3); }`;
const Grid = styled.div`display: grid; gap: 24px;`;
const Card = styled.div`background: #0f0f14; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; display: flex; gap: 20px;`;
const CardImage = styled.img`width: 80px; height: 80px; border-radius: 10px; object-fit: cover;`;
const CardContent = styled.div`flex: 1;`;
const CardHeader = styled.div`display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;`;
const CardTitle = styled.h3`font-size: 18px; font-weight: 600; color: #f2f3f4; margin-bottom: 4px;`;
const CardSubtitle = styled.div`font-size: 14px; color: #b1b2b3; margin-bottom: 4px;`;
const CardDate = styled.div`font-size: 12px; color: #854ce6;`;
const CardDescription = styled.p`font-size: 14px; color: #b1b2b3; line-height: 1.6; margin-bottom: 8px;`;
const Grade = styled.div`font-size: 14px; color: #10b981; font-weight: 500;`;
const ActionButtons = styled.div`display: flex; gap: 8px;`;
const IconButton = styled.button<{ variant?: 'edit' | 'delete' }>`background: ${({ variant }) => variant === 'delete' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(133, 76, 230, 0.1)'}; border: 1px solid ${({ variant }) => variant === 'delete' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(133, 76, 230, 0.3)'}; border-radius: 6px; padding: 8px; color: ${({ variant }) => variant === 'delete' ? '#ff6b6b' : '#854ce6'}; cursor: pointer; &:hover { background: ${({ variant }) => variant === 'delete' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(133, 76, 230, 0.2)'}; }`;
const Modal = styled.div<{ isOpen }>`display: ${({ isOpen }) => isOpen ? 'flex' : 'none'}; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); align-items: center; justify-content: center; z-index: 1000; padding: 20px;`;
const ModalContent = styled.div`background: #0f0f14; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 32px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto;`;
const ModalHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;`;
const ModalTitle = styled.h2`font-size: 24px; font-weight: 600; color: #f2f3f4;`;
const CloseButton = styled.button`background: none; border: none; color: #b1b2b3; cursor: pointer; &:hover { color: #f2f3f4; }`;
const Form = styled.form`display: flex; flex-direction: column; gap: 20px;`;
const FormGroup = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const Label = styled.label`font-size: 14px; font-weight: 500; color: #f2f3f4;`;
const Input = styled.input`background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px 16px; font-size: 16px; color: #f2f3f4; &:focus { outline: none; border-color: #854ce6; }`;
const Textarea = styled.textarea`background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px 16px; font-size: 16px; color: #f2f3f4; min-height: 100px; resize: vertical; font-family: inherit; &:focus { outline: none; border-color: #854ce6; }`;
const ImageUploadButton = styled.button`background: rgba(133, 76, 230, 0.1); border: 1px solid rgba(133, 76, 230, 0.3); border-radius: 8px; padding: 12px 16px; color: #854ce6; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; &:hover { background: rgba(133, 76, 230, 0.2); }`;
const SubmitButton = styled.button`background: linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%); border: none; border-radius: 8px; padding: 14px 24px; font-size: 16px; font-weight: 600; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; &:disabled { opacity: 0.5; cursor: not-allowed; }`;
const ErrorMessage = styled.span`color: #ff6b6b; font-size: 14px;`;

const educationSchema = z.object({
  school: z.string().min(1, 'School name is required'),
  degree: z.string().min(1, 'Degree is required'),
  date: z.string().min(1, 'Date is required'),
  grade: z.string().min(1, 'Grade is required'),
  desc: z.string().min(10, 'Description must be at least 10 characters'),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface Education extends EducationFormData {
  _id?;
  img;
  order;
}

export default function EducationManagementPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [schoolImage, setSchoolImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(educationSchema),
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/education');
      const data = await response.json();
      setEducationList(data);
    } catch (error) {
      console.error('Error fetching education:', error);
    }
  };

  const handleOpenModal = (item?: Education) => {
    if (item) {
      setEditingItem(item);
      reset(item);
      setSchoolImage(item.img);
    } else {
      setEditingItem(null);
      reset({ school: '', degree: '', date: '', grade: '', desc: '' });
      setSchoolImage('');
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'portfolio/education');

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.url) setSchoolImage(data.url);
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: EducationFormData) => {
    if (!schoolImage) {
      alert('Please upload a school logo');
      return;
    }

    const payload = { ...data, img: schoolImage, order: editingItem?.order ?? educationList.length };

    try {
      const url = editingItem ? `/api/education/${editingItem._id}` : '/api/education';
      const method = editingItem ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (response.ok) {
        await fetchEducation();
        setIsModalOpen(false);
      } else {
        alert('Failed to save education');
      }
    } catch (error) {
      alert('Failed to save education');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;
    try {
      const response = await fetch(`/api/education/${id}`, { method: 'DELETE' });
      if (response.ok) await fetchEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  return (
    
      
        Education Management</Title>
        <AddButton onClick={() => handleOpenModal()}><FiPlus />Add Education</AddButton>
      </Header>

      
        {educationList.map((edu) => (
          <Card key={edu._id}>
            <CardImage src={edu.img} alt={edu.school} />
            
              
                
                  {edu.school}</CardTitle>
                  {edu.degree}</CardSubtitle>
                  {edu.date}</CardDate>
                </div>
                
                  <IconButton onClick={() => handleOpenModal(edu)}><FiEdit2 /></IconButton>
                  <IconButton variant="delete" onClick={() => handleDelete(edu._id!)}><FiTrash2 /></IconButton>
                </ActionButtons>
              </CardHeader>
              Grade: {edu.grade}</Grade>
              {edu.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </Grid>

      <Modal isOpen={isModalOpen}>
        
          
            {editingItem ? 'Edit' : 'Add'} Education</ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}><FiX size={24} /></CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit(onSubmit)}>
            
              School Logo</Label>
              <ImageUploadButton type="button" onClick={() => document.getElementById('school-image')?.click()}>
                <FiUpload />{isUploading ? 'Uploading...' : schoolImage ? 'Change Image' : 'Upload Image'}
              </ImageUploadButton>
              {schoolImage && <img src={schoolImage} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '8px', marginTop: '8px' }} />}
              <input id="school-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </FormGroup>

            
              School Name *</Label>
              <Input placeholder="University Name" {...register('school')} />
              {errors.school && {errors.school.message}</ErrorMessage>}
            </FormGroup>

            
              Degree *</Label>
              <Input placeholder="Bachelor of Science in Computer Science" {...register('degree')} />
              {errors.degree && {errors.degree.message}</ErrorMessage>}
            </FormGroup>

            
              Date *</Label>
              <Input placeholder="2019 - 2023" {...register('date')} />
              {errors.date && {errors.date.message}</ErrorMessage>}
            </FormGroup>

            
              Grade *</Label>
              <Input placeholder="3.8 GPA or 85%" {...register('grade')} />
              {errors.grade && {errors.grade.message}</ErrorMessage>}
            </FormGroup>

            
              Description *</Label>
              <Textarea placeholder="Describe your education..." {...register('desc')} />
              {errors.desc && {errors.desc.message}</ErrorMessage>}
            </FormGroup>

            <SubmitButton type="submit"><FiSave />Save Education</SubmitButton>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
}

