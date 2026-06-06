import { Test, TestingModule } from '@nestjs/testing';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { GenerateMessage } from '../../src/messageAI/use-cases/post-generate-message';
import { NotFoundException } from '@nestjs/common';
import {
  TypeMessage,
  GenerateMessageDto,
} from '../../src/messageAI/dto/create-message.dto';
import { Commerce } from '@prisma/client';

const mockCustomers = [
  {
    id: '123',
    name: 'Jesse',
    phone: '19999999999',
    address: null,
    createdAt: new Date(),
    businessId: 'business-test-id',
    pets: [
      {
        id: 'pet-1',
        name: 'Rex',
        breed: 'Labrador',
        lastBath: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        customerId: '123',
        businessId: 'business-test-id',
        createdAt: new Date(),
      },
    ],
    vehicles: [],
    appointments: [
      {
        id: 'apt-1',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        notes: 'Banho completo',
        status: 'SCHEDULED',
        customerId: '123',
        userId: 'user-1',
        businessId: 'business-test-id',
        createdAt: new Date(),
        petId: 'pet-1',
        vehicleId: null,
      },
    ],
  },
  {
    id: '1234',
    name: 'Gabi',
    phone: '19999999998',
    address: null,
    createdAt: new Date(),
    businessId: 'business-test-id',
    pets: [
      {
        id: 'pet-2',
        name: 'Preta',
        breed: 'Vira-lata',
        lastBath: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        customerId: '1234',
        businessId: 'business-test-id',
        createdAt: new Date(),
      },
    ],
    vehicles: [],
    appointments: [
      {
        id: 'apt-2',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        notes: 'Banho completo',
        status: 'SCHEDULED',
        customerId: '1234',
        userId: 'user-1',
        businessId: 'business-test-id',
        createdAt: new Date(),
        petId: 'pet-2',
        vehicleId: null,
      },
    ],
  },
];

const baseDto = (type: TypeMessage): GenerateMessageDto => ({
  customerId: mockCustomers[0].id,
  type,
  commerce: Commerce.PETSHOP,
  petId: 'pet-1',
});

const businessId = 'business-test-id';

describe('GenerateMessage', () => {
  let useCase: GenerateMessage;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Mensagem gerada pela IA' } }],
      }),
    } as unknown as Response);

    useCase = new GenerateMessage(mockPrisma as any);
  });

  it('should throw NotFoundException when customer does not exist', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute(baseDto(TypeMessage.AGENDAMENTO), businessId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return messageIA and phone when customer exists', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    const result = await useCase.execute(
      baseDto(TypeMessage.COBRANCA),
      businessId,
    );

    expect(result).toHaveProperty('messageIA');
    expect(result).toHaveProperty('phone');
    expect(result.phone).toBe(mockCustomers[0].phone);
  });

  it('should generate message for AGENDAMENTO', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    const result = await useCase.execute(
      baseDto(TypeMessage.AGENDAMENTO),
      businessId,
    );

    expect(result).toBeDefined();
  });

  it('should generate message for LEMBRETE_BANHO', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    const result = await useCase.execute(
      baseDto(TypeMessage.LEMBRETE_BANHO),
      businessId,
    );

    expect(result).toBeDefined();
  });

  it('should generate message for COBRANCA', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    const result = await useCase.execute(
      baseDto(TypeMessage.COBRANCA),
      businessId,
    );

    expect(result).toBeDefined();
  });

  it('should return 0 when lastBath is null', () => {
    const result = (useCase as any).daysSinceLastBath(null);
    expect(result).toBe(0);
  });

  it('should calculate days correctly since last bath', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = (useCase as any).daysSinceLastBath(date);
    expect(result).toBe(3);
  });

  it('should generate prompt containing customer and pet name for LEMBRETE_BANHO', () => {
    const pet = mockCustomers[0].pets[0];
    const prompt = (useCase as any).assemblePrompt(
      mockCustomers[0],
      TypeMessage.LEMBRETE_BANHO,
      Commerce.PETSHOP,
      pet,
      undefined,
    );

    expect(prompt).toContain('Jesse');
    expect(prompt).toContain('Rex');
    expect(prompt).toContain('5');
  });

  it('should generate prompt containing customer and pet name for AGENDAMENTO', () => {
    const pet = mockCustomers[0].pets[0];
    const prompt = (useCase as any).assemblePrompt(
      mockCustomers[0],
      TypeMessage.AGENDAMENTO,
      Commerce.PETSHOP,
      pet,
      undefined,
    );

    expect(prompt).toContain('Jesse');
    expect(prompt).toContain('Rex');
  });

  it('should generate prompt for COBRANCA', () => {
    const pet = mockCustomers[0].pets[0];
    const prompt = (useCase as any).assemblePrompt(
      mockCustomers[0],
      TypeMessage.COBRANCA,
      Commerce.PETSHOP,
      pet,
      undefined,
    );

    expect(prompt).toContain('Jesse');
    expect(prompt).toContain('Rex');
  });

  it('should return phone of customer', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    const result = await useCase.execute(
      baseDto(TypeMessage.LEMBRETE_BANHO),
      businessId,
    );

    expect(result.phone).toBe('19999999999');
  });

  it('should call fetch with correct Groq API URL', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    await useCase.execute(baseDto(TypeMessage.LEMBRETE_BANHO), businessId);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('should generate prompt with vehicle data for AUTOMOTIVE', () => {
    const mockVehicleCustomer = {
      ...mockCustomers[0],
      pets: [],
      vehicles: [
        {
          id: 'vehicle-1',
          brand: 'Toyota',
          model: 'Corolla',
          plate: 'ABC1D23',
          customerId: '123',
          businessId: 'business-test-id',
          createdAt: new Date(),
        },
      ],
    };

    const prompt = (useCase as any).assemblePrompt(
      mockVehicleCustomer,
      TypeMessage.VEICULO_PRONTO,
      Commerce.AUTOMOTIVE,
      undefined,
      mockVehicleCustomer.vehicles[0],
    );

    expect(prompt).toContain('Jesse');
    expect(prompt).toContain('Toyota');
    expect(prompt).toContain('Corolla');
  });

  it('should generate prompt for FEMININE_AESTHETIC', () => {
    const prompt = (useCase as any).assemblePrompt(
      mockCustomers[0],
      TypeMessage.LEMBRETE_PROCEDIMENTO,
      Commerce.FEMININE_AESTHETIC,
      undefined,
      undefined,
    );

    expect(prompt).toContain('Jesse');
  });
});
