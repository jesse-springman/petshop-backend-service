import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { GenerateMessage } from '../../src/messageAI/use-cases/post-generate-message';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TypeMessage } from '../../src/messageAI/dto/create-message.dto';

const mockCustomers = [
  {
    id: '123',
    customer_name: 'Jesse',
    pet_name: 'Rex',
    pet_breed: 'Labrador',
    last_bath: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    number_customer: '19999999999',
    appointments: [
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // futuro
        notes: 'Banho completo',
      },
    ],
  },

  {
    id: '1234',
    customer_name: 'gabi',
    pet_name: 'preta',
    pet_breed: 'vira-lata',
    last_bath: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    number_customer: '19999999999',
    appointments: [
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // futuro
        notes: 'Banho completo',
      },
    ],
  },
];

describe('GET /respostaAI', () => {
  let useCase: GenerateMessage;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: { content: 'Mensagem gerada pela IA' },
          },
        ],
      }),
    } as unknown as Response); //fecth espera um obj do tipo Response,

    useCase = new GenerateMessage(mockPrisma as any);
  });

  it('should throw NotFoundException, when customer does not exist', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute({
        customerId: 'id-invalido',
        type: TypeMessage.AGENDAMENTO,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return message when customer exist', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Mensagem gerada pela IA',
            },
          },
        ],
      }),
    });

    const result = await useCase.execute({
      customerId: mockCustomers[0].id,
      type: TypeMessage.COBRANCA,
    });

    expect(result).toHaveProperty('messageIA');
    expect(result).toHaveProperty('phone');
    expect(result.phone).toBe(mockCustomers[0].number_customer);
  });

  it('should generate message  for AGENDAMENTO', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ result: 'ok' }),
    });

    const result = await useCase.execute({
      customerId: mockCustomers[0].id,
      type: TypeMessage.AGENDAMENTO,
    });

    expect(result).toBeDefined();
  });

  it('Should generate message for LEMBRENTE_BANHO', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ result: 'ok' }),
    });

    const result = await useCase.execute({
      customerId: mockCustomers[0].id,
      type: TypeMessage.LEMBRETE_BANHO,
    });

    expect(result).toBeDefined();
  });

  it('Shoud generate message for COBRANCA', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ result: 'ok' }),
    });

    const result = await useCase.execute({
      customerId: mockCustomers[0].id,
      type: TypeMessage.COBRANCA,
    });

    expect(result).toBeDefined();
  });

  it('Should return 0 when last_bath is null', async () => {
    const result = (useCase as any).daysSinceWithoutBath(null);

    expect(result).toBe(0);
  });

  it('Should calculte days correct without bath', async () => {
    const dateWithoutBath = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const result = (useCase as any).daysSinceWithoutBath(dateWithoutBath);

    expect(result).toBe(3);
  });

  it('should generate prompt with customer data', async () => {
    const prompt = (useCase as any).assemblePrompt(
      mockCustomers[0],
      5,
      TypeMessage.LEMBRETE_BANHO,
    );

    expect(prompt).toContain('Jesse');
    expect(prompt).toContain('Rex');
  });

  it('Should generate prompt with appointment date of AGENDAMENTO', async () => {
    const prompt = (useCase as any).assemblePrompt(
      mockCustomers[0],
      5,
      TypeMessage.AGENDAMENTO,
    );

    expect(prompt).toContain('Jesse');
    expect(prompt).toContain('Rex');
  });

  it('Should generate prompt for COBRANCA', async () => {
    const prompt = (useCase as any).assemblePrompt(
      mockCustomers[0],
      5,
      TypeMessage.COBRANCA,
    );

    expect(prompt).toContain('Jesse');
    expect(prompt).toContain('Rex');
  });

  it('should return phone of customer', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    const result = await useCase.execute({
      customerId: mockCustomers[0].id,
      type: TypeMessage.LEMBRETE_BANHO,
    });

    expect(result.phone).toBe('19999999999');
  });

  it('should call fetch with correct GroqAPI', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(mockCustomers[0]);

    await useCase.execute({
      customerId: mockCustomers[0].id,
      type: TypeMessage.LEMBRETE_BANHO,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',

      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('should generate prompt with days without bath', async () => {
    const prompt = (useCase as any).assemblePrompt(
      mockCustomers[0],
      5,
      TypeMessage.LEMBRETE_BANHO,
    );

    expect(prompt).toContain('5');
  });
});
