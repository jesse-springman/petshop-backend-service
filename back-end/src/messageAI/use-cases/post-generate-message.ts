import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';
import { GenerarteMessageDto, TypeMessage } from '../dto/create-message.dto';
import { Prisma } from '@prisma/client';

type CustomerWithAppointments = Prisma.CustomerGetPayload<{
  include: { appointments: true };
}>;

@Injectable()
export class GenerateMessage {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: GenerarteMessageDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
      include: {
        appointments: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Esse usuário não foi encontrado');
    }

    const daysWithoutBath = this.daysSinceWithoutBath(customer.last_bath);
    const promptFinished = this.assemblePrompt(
      customer,
      daysWithoutBath,
      data.type,
    );
    const messageIA = await this.generateMessageIA(promptFinished);

    return {
      messageIA,
      phone: customer.number_customer,
    };
  }

  private daysSinceWithoutBath(last_bath: Date | null): number {
    if (!last_bath) return 0; //guard caso n tenha registro

    const today = new Date();
    const diff = today.getTime() - last_bath.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return days;
  }

  private assemblePrompt(
    customer: CustomerWithAppointments,
    daysSinceWithoutBath: number,
    type: TypeMessage,
  ): string | undefined {
    if (type === 'LEMBRETE_BANHO') {
      return `Gere uma mensagem curta e profissional de WhatsApp lembrando o cliente que o pet está há muito tempo sem banho.
    REGRAS:
    - Mencione o nome do cliente e do pet
    - Mencione quantos dias o pet está sem banho de forma natural
    - Sugira agendar um banho e tosa
    - Tom amigável mas profissional — NÃO use humor, piadas ou comentários sobre aparência
    - NÃO invente informações que não foram fornecidas
    - Máximo 4 linhas

        Cliente: ${customer.customer_name}
        Pet: ${customer.pet_name}
        Raça: ${customer.pet_breed}
        Dias sem banho: ${daysSinceWithoutBath}
         Incentive o agendamento de forma simpática.
         `;
    }

    if (type === 'AGENDAMENTO') {
      const nextAppointment = customer.appointments
        .filter((a) => new Date(a.date) > new Date())
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )[0];
      return `
    Gere uma mensagem curta de WhatsApp lembrando o cliente que ele JÁ TEM um agendamento marcado.
    NÃO sugira agendar — o agendamento já está confirmado.
    NÃO pergunte disponibilidade — a data já está definida.
    
    Cliente: ${customer.customer_name}
    Pet: ${customer.pet_name}
    Data e hora do agendamento: ${
      nextAppointment
        ? new Date(nextAppointment.date).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'não definida'
    }
    Serviço: ${nextAppointment?.notes || 'banho e tosa'}
    
    Lembre o cliente da data e horário confirmados e peça para avisar caso precise remarcar.
  `;
    }
    //COBRANÇA
    return `  Gere uma mensagem de cobrança educada e profissional para WhatsApp.
  
  REGRAS:
  - Mencione o nome do cliente e do pet
  - Informe que existe um pagamento pendente referente ao serviço de banho e tosa
  - Solicite o pagamento de forma educada e sem pressão
  - NÃO mencione cancelamento, desconto ou reembolso
  - NÃO invente valores — não temos o valor da cobrança
  - NÃO seja agressivo ou ameaçador
  - Tom profissional e cordial
  - Máximo 4 linhas
            Cliente: ${customer.customer_name}
            Pet: ${customer.pet_name}
        `;
  }
  private async generateMessageIA(
    prompt: string | undefined,
  ): Promise<string | any> {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `Você é um assistente de comunicação de um petshop chamado New-Pettz.
          Seu trabalho é gerar mensagens para WhatsApp para os clientes do petshop.
          O petshop oferece somente serviços de banho e tosa, corte de unha — NÃO é uma clínica veterinária.
          As mensagens devem ser curtas, amigáveis e em português brasileiro.
          Nunca mencione veterinário, consulta ou clínica.
          Sempre assine como "Equipe New-Pettz 🐾".`,
            },
            { role: 'user', content: prompt },
          ],
        }),
      },
    );

    const data = await response.json();
    console.log(data);
    return data;
  }
}
