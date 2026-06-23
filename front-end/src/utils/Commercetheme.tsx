import { Commerce } from "@/types/commerce";

export type CommerceTheme = {
  // Cores principais
  primary: string; // ex: "amber-400"
  primaryHex: string; // ex: "#fbbf24"
  primaryLight: string; // ex: "amber-500/10"
  primaryBorder: string; // ex: "amber-500/40"
  primaryHover: string; // ex: "amber-400"
  glowHex: string; // cor do glow rgba

  // Textos
  title: string;
  subtitle: string;
  registerText: string;
  welcomeText: string;
  footerText: string;

  // Imagem
  image: string;
  imageAlt: string;

  // Botão de login
  loginBtnClass: string;
  inputBorderClass: string;
  inputFocusClass: string;
};

export const commerceThemes: Record<Commerce, CommerceTheme> = {
  PETSHOP: {
    primary: "amber-400",
    primaryHex: "#fbbf24",
    primaryLight: "amber-500/10",
    primaryBorder: "amber-500/40",
    primaryHover: "amber-400",
    glowHex: "rgba(251,191,36,0.2)",

    title: "New-Pettz",
    subtitle:
      "Seu petshop moderno e confiável. Cadastre clientes, gerencie atendimentos e cuide dos seus pets com tecnologia de ponta.",
    registerText: "Registre seu petshop e comece a usar agora mesmo 🐾",
    welcomeText: "Você tem acesso completo ao sistema.",
    footerText: "© 2025 New-Pettz. Todos os direitos reservados.",

    image: "/images/labrador.png",
    imageAlt: "New-Pettz Petshop",

    loginBtnClass: "bg-amber-500 hover:bg-amber-400 text-black",
    inputBorderClass: "border-amber-500/40",
    inputFocusClass: "focus:border-amber-400",
  },

  AUTOMOTIVE: {
    primary: "blue-400",
    primaryHex: "#60a5fa",
    primaryLight: "blue-500/10",
    primaryBorder: "blue-500/40",
    primaryHover: "blue-400",
    glowHex: "rgba(96,165,250,0.2)",

    title: "AutoFlow",
    subtitle:
      "Gestão completa para sua estética automotiva. Controle agendamentos, clientes e serviços com precisão.",
    registerText: "Registre sua estética automotiva e comece agora 🚗",
    welcomeText: "Você tem acesso completo ao sistema.",
    footerText: "© 2025 AutoFlow. Todos os direitos reservados.",

    image: "/images/black.png",
    imageAlt: "AutoFlow Estética Automotiva",

    loginBtnClass: "bg-blue-500 hover:bg-blue-400 text-white",
    inputBorderClass: "border-blue-500/40",
    inputFocusClass: "focus:border-blue-400",
  },

  FEMININE_AESTHETIC: {
    primary: "rose-400",
    primaryHex: "#fb7185",
    primaryLight: "rose-500/10",
    primaryBorder: "rose-500/40",
    primaryHover: "rose-400",
    glowHex: "rgba(251,113,133,0.2)",

    title: "FlowHub",
    subtitle:
      "Gestão inteligente para sua estética feminina. Agendamentos, clientes e mensagens automáticas em um só lugar.",
    registerText: "Registre sua estética e comece a usar agora ✨",
    welcomeText: "Você tem acesso completo ao sistema.",
    footerText: "© 2025 FlowHub. Todos os direitos reservados.",

    image: "/images/feminine.png",
    imageAlt: "FlowHub Estética Feminina",

    loginBtnClass: "bg-rose-500 hover:bg-rose-400 text-white",
    inputBorderClass: "border-rose-500/40",
    inputFocusClass: "focus:border-rose-400",
  },
};
