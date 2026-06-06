import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';
import { GenerateMessageDto, TypeMessage } from '../dto/create-message.dto';
import { Commerce, Prisma } from '@prisma/client';

type CustomerWithRelations = Prisma.CustomerGetPayload<{
  include: {
    appointments: true;
    pets: true;
    vehicles: true;
  };
}>;

@Injectable()
export class GenerateMessage {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: GenerateMessageDto, businessId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId, businessId },
      include: {
        appointments: true,
        pets: true,
        vehicles: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const pet = data.petId
      ? customer.pets.find((p) => p.id === data.petId)
      : customer.pets[0];

    const vehicle = data.vehicleId
      ? customer.vehicles.find((v) => v.id === data.vehicleId)
      : customer.vehicles[0];

    const promptFinished = this.assemblePrompt(
      customer,
      data.type,
      data.commerce,
      pet,
      vehicle,
    );

    const messageIA = await this.generateMessageIA(
      promptFinished,
      data.commerce,
    );

    return {
      messageIA,
      phone: customer.phone,
    };
  }

  private daysSinceLastBath(lastBath: Date | null): number {
    if (!lastBath) return 0;
    const diff = new Date().getTime() - lastBath.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private getNextAppointment(customer: CustomerWithRelations) {
    return customer.appointments
      .filter((a) => new Date(a.date) > new Date())
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )[0];
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private assemblePrompt(
    customer: CustomerWithRelations,
    type: TypeMessage,
    commerce: Commerce,
    pet?: any,
    vehicle?: any,
  ): string {
    const nextAppointment = this.getNextAppointment(customer);
    const appointmentDate = nextAppointment
      ? this.formatDate(nextAppointment.date)
      : 'não definida';

    // PETSHOP
    if (commerce === Commerce.PETSHOP) {
      const daysWithoutBath = this.daysSinceLastBath(pet?.lastBath ?? null);

      if (type === TypeMessage.LEMBRETE_BANHO) {
        return `Gere uma mensagem curta e profissional de WhatsApp lembrando o cliente que o pet está há muito tempo sem banho.
REGRAS:
- Mencione o nome do cliente e do pet
- Mencione quantos dias o pet está sem banho de forma natural
- Sugira agendar um banho e tosa
- Tom amigável mas profissional — NÃO use humor ou piadas
- NÃO invente informações não fornecidas
- Máximo 4 linhas

Cliente: ${customer.name}
Pet: ${pet?.name ?? 'não informado'}
Raça: ${pet?.breed ?? 'não informada'}
Dias sem banho: ${daysWithoutBath}`;
      }

      if (type === TypeMessage.AGENDAMENTO) {
        return `Gere uma mensagem curta de WhatsApp lembrando o cliente que ele JÁ TEM um agendamento marcado.
NÃO sugira agendar — o agendamento já está confirmado.

Cliente: ${customer.name}
Pet: ${pet?.name ?? 'não informado'}
Data e hora: ${appointmentDate}
Serviço: ${nextAppointment?.notes ?? 'banho e tosa'}

Lembre a data confirmada e peça para avisar caso precise remarcar.`;
      }

      if (type === TypeMessage.COBRANCA) {
        return `Gere uma mensagem de cobrança educada e profissional para WhatsApp.
REGRAS:
- Mencione o nome do cliente e do pet
- Informe pagamento pendente referente a serviço de banho e tosa
- Solicite pagamento de forma educada, sem pressão
- NÃO mencione cancelamento, desconto ou valores
- Tom profissional e cordial
- Máximo 4 linhas

Cliente: ${customer.name}
Pet: ${pet?.name ?? 'não informado'}`;
      }
    }

    // AUTOMOTIVO
    if (commerce === Commerce.AUTOMOTIVE) {
      if (type === TypeMessage.LEMBRETE_REVISAO) {
        return `Gere uma mensagem curta de WhatsApp lembrando o cliente que o veículo está há um tempo sem revisão/higienização.
REGRAS:
- Mencione o nome do cliente e o veículo
- Sugira agendar uma higienização ou revisão estética
- Tom amigável e profissional
- Máximo 4 linhas

Cliente: ${customer.name}
Veículo: ${vehicle?.brand ?? ''} ${vehicle?.model ?? 'não informado'}
Placa: ${vehicle?.plate ?? 'não informada'}`;
      }

      if (type === TypeMessage.VEICULO_PRONTO) {
        return `Gere uma mensagem curta de WhatsApp informando que o veículo do cliente já está pronto para retirada.
REGRAS:
- Mencione o nome do cliente e o veículo
- Informe que o serviço foi concluído
- Tom amigável e profissional
- Máximo 3 linhas

Cliente: ${customer.name}
Veículo: ${vehicle?.brand ?? ''} ${vehicle?.model ?? 'não informado'}
Placa: ${vehicle?.plate ?? 'não informada'}`;
      }

      if (type === TypeMessage.AGENDAMENTO) {
        return `Gere uma mensagem curta de WhatsApp lembrando o cliente do agendamento confirmado para o veículo.

Cliente: ${customer.name}
Veículo: ${vehicle?.brand ?? ''} ${vehicle?.model ?? 'não informado'}
Data e hora: ${appointmentDate}
Serviço: ${nextAppointment?.notes ?? 'estética automotiva'}`;
      }

      if (type === TypeMessage.COBRANCA) {
        return `Gere uma mensagem de cobrança educada para WhatsApp referente a serviço automotivo.

Cliente: ${customer.name}
Veículo: ${vehicle?.brand ?? ''} ${vehicle?.model ?? 'não informado'}
Solicite o pagamento de forma cordial, sem mencionar valores ou cancelamento.
Máximo 4 linhas.`;
      }
    }

    // ESTÉTICA FEMININA
    if (commerce === Commerce.FEMININE_AESTHETIC) {
      if (type === TypeMessage.LEMBRETE_PROCEDIMENTO) {
        return `Gere uma mensagem curta de WhatsApp lembrando a cliente que está na hora de renovar o procedimento estético.
REGRAS:
- Mencione o nome da cliente
- Sugira agendar o retorno para manutenção
- Tom acolhedor e profissional
- Máximo 4 linhas

Cliente: ${customer.name}
Serviço anterior: ${nextAppointment?.notes ?? 'procedimento estético'}`;
      }

      if (type === TypeMessage.RETORNO) {
        return `Gere uma mensagem curta de WhatsApp convidando a cliente a agendar seu retorno.
REGRAS:
- Mencione o nome da cliente
- Reforce a qualidade do serviço
- Tom acolhedor e profissional
- Máximo 4 linhas

Cliente: ${customer.name}`;
      }

      if (type === TypeMessage.AGENDAMENTO) {
        return `Gere uma mensagem curta de WhatsApp lembrando a cliente do agendamento confirmado.

Cliente: ${customer.name}
Data e hora: ${appointmentDate}
Serviço: ${nextAppointment?.notes ?? 'procedimento estético'}

Lembre a data confirmada e peça para avisar caso precise remarcar.`;
      }

      if (type === TypeMessage.COBRANCA) {
        return `Gere uma mensagem de cobrança educada para WhatsApp referente a serviço de estética.

Cliente: ${customer.name}
Solicite o pagamento de forma cordial, sem mencionar valores ou cancelamento.
Máximo 4 linhas.`;
      }
    }

    return `Gere uma mensagem profissional e cordial de WhatsApp para o cliente ${customer.name}.`;
  }

  private async generateMessageIA(
    prompt: string,
    commerce: Commerce,
  ): Promise<string> {
    const systemPrompts: Record<Commerce, string> = {
      [Commerce.PETSHOP]: `Você é um assistente de comunicação de um petshop.
Seu trabalho é gerar mensagens para WhatsApp para os clientes.
O petshop oferece serviços de banho, tosa e corte de unhas — NÃO é clínica veterinária.
As mensagens devem ser curtas, amigáveis e em português brasileiro.
Nunca mencione veterinário, consulta ou clínica.
Sempre assine como "Equipe do Petshop 🐾".`,

      [Commerce.AUTOMOTIVE]: `Você é um assistente de comunicação de uma estética automotiva.
Seu trabalho é gerar mensagens para WhatsApp para os clientes.
As mensagens devem ser curtas, profissionais e em português brasileiro.
Sempre assine como "Equipe da Estética Automotiva 🚗".`,

      [Commerce.FEMININE_AESTHETIC]: `Você é um assistente de comunicação de um estúdio de estética feminina.
Seu trabalho é gerar mensagens para WhatsApp para as clientes.
Os serviços incluem cílios, unhas e sobrancelhas.
As mensagens devem ser curtas, acolhedoras e em português brasileiro.
Sempre assine como "Equipe do Estúdio 💅".`,
    };

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompts[commerce] },
            { role: 'user', content: prompt },
          ],
        }),
      },
    );

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content ??
      'Não foi possível gerar a mensagem.'
    );
  }
}
