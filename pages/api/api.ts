import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import {
  InsuranceApplication,
  Vehicle,
  PersonInsuranceApplication
} from './interfaces';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body,
  } = req;

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }

  switch (method) {
    case 'POST': {
      try {
        const data = body as InsuranceApplication;
        const createdApplication = await prisma.insuranceApplication.create({
          data: {
            dateCreated: data.dateCreated,
            address: { connect: { id: data.addressId } },
            vehicles: {
              create: data.vehicles && (data.vehicles as Vehicle[]).map((vehicle) => ({
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
              })),
            },
            personInsuranceApplications: {
              create: data.personInsuranceApplications && (data.personInsuranceApplications as PersonInsuranceApplication[]).map(
                (personApplication) => ({
                  person: { connect: { id: personApplication.personId } },
                }),
              ),
            },
          },
          include: {
            address: true,
            vehicles: {
              include: {
                insuranceApplication: true,
              },
            },
            personInsuranceApplications: {
              include: {
                application: true,
              },
            },
          },
        });
        
        res.status(201).json(createdApplication);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;
    }
    
    case 'GET': {
      try {
        const application = await prisma.insuranceApplication.findUnique({
          where: { id: parseInt(id) },
          include: {
            address: true,
            vehicles: true,
            personInsuranceApplications: {
              include: { person: true },
            },
          },
        });
        res.status(200).json(application);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;
    }
    case 'PUT': {
      try {
        const data = body as InsuranceApplication;
        const updatedApplication = await prisma.insuranceApplication.update({
          where: { id: parseInt(id as string) },
          data: {
            dateCreated: data.dateCreated,
            address: { connect: { id: data.addressId } },
            vehicles: {
              deleteMany: {},
              create: data.vehicles && (data.vehicles as Vehicle[]).map((vehicle) => ({
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
              })),
            },
            personInsuranceApplications: {
              deleteMany: {},
              create: data.personInsuranceApplications && (data.personInsuranceApplications as PersonInsuranceApplication[]).map(
                (personApplication) => ({
                  person: { connect: { id: personApplication.personId } },
                  application: { connect: { id: personApplication.applicationId } },
                }),
              ),
            },
          },
          include: {
            address: true,
            vehicles: {
              include: {
                insuranceApplication: true,
              },
            },
            personInsuranceApplications: {
              include: {
                application: true,
              },
            },
          },
        });
    
        res.json(updatedApplication);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;
    }
    
    case 'DELETE': {
      try {
        const deletedApplication = await prisma.insuranceApplication.delete({
          where: { id: parseInt(id) },
          include: {
            address: true,
            vehicles: true,
            personInsuranceApplications: true,
          },
        });
        res.status(200).json(deletedApplication);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
  await prisma.$disconnect();
}