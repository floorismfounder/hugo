import { useState } from 'react';
import {
  InsuranceApplication,
  Address,
  Vehicle,
  Person,
  Relationship,
} from '../pages/api/interfaces';
import formConfig from './formConfig.json';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const App = () => {
  const [applications, setApplications] = useState<InsuranceApplication[]>([]);
  const [newApplication, setNewApplication] = useState<InsuranceApplication>({
    id: undefined,
    dateCreated: new Date(),
    resumeUrl: '',
    addressId: 0,
    vehicles: { create: [] },
    personInsuranceApplications: { create: [] },
  });
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            street: formData['street'],
            city: formData['city'],
            state: formData['state'],
            zipCode: formData['zipCode'],
          },
          vehicles: [
            {
              make: formData['make'],
              model: formData['model'],
              year: Number(formData['year']),
            },
          ],
          personInsuranceApplications: [
            {
              person: {
                firstName: formData['firstName'],
                lastName: formData['lastName'],
                dateOfBirth: new Date(formData['dateOfBirth']),
                relationship: formData['relationship'] as Relationship,
              },
            },
          ],
        }),
      });
      if (res.ok) {
        const { id, resumeUrl } = await res.json();
        const newApplication: InsuranceApplication = {
          id,
          dateCreated: new Date(),
          resumeUrl,
          addressId: 0,
          vehicles: { create: [] },
          personInsuranceApplications: { create: [] },
        };
        setApplications([...applications, newApplication]);
        setNewApplication({
          id: undefined,
          dateCreated: new Date(),
          resumeUrl: '',
          addressId: 0,
          vehicles: { create: [] },
          personInsuranceApplications: { create: [] },
        });
        setFormData({});
      } else {
        console.error(await res.text());
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <Typography variant="h1">Applications</Typography>
      <ul>
        {applications.map((application) => (
          <li key={application.id}>
            {application.id} - {application.dateCreated.toDateString()} -{' '}
            <a href={application.resumeUrl} target="_blank" rel="noreferrer">
              Resume
            </a>
          </li>
        ))}
      </ul>
      <Typography variant="h2">Add Application</Typography>
      <form onSubmit={handleSubmit}>
        {formConfig.map((field) => {
          const { name, label, type } = field;
          return (
            <div key={name}>
              <TextField
                fullWidth
                label={label}
                name={name}
                type={type}
                value={formData[name] || ''}
                onChange={handleChange}
              />
            </div>
          );
        })}
        <br />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
  
};

export default App
