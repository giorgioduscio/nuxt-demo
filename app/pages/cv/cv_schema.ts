export interface CV {
  id: number;

  title: string;
  subtitle: string;
  description: string;
  image: string;

  birth_date: string;
  email: string;
  phone: string;
  address: string;

  contacts: { [key:string]: string };

  hard_skills: {
    title: string, 
    level: string, 
    description: string
  }[];

  soft_skills: {
    title: string, 
    description: string
  }[];
  
  hobby: {
    title: string, 
    description: string
  }[];
  
  lenguages: {
    title: string, 
    level: string,
    description: string
  }[];

  experiences: {
    period: string,
    company: string,
    role: string,
    start_date :string,
    description: string,
  }[]
}

/*
{
  "id": 1,
  "title": "Mario Rossi",
  "subtitle": "Full Stack Developer",
  "description": "Sviluppatore con 5 anni di esperienza nella creazione di applicazioni web moderne",
  "image": "/images/profile.jpg",
  "birth_date": "1990-05-15",
  "email": "mario.rossi@example.com",
  "phone": "+39 333 1234567",
  "address": "Via Roma 10, Milano",
  "contacts": {
    "linkedin": "linkedin.com/in/mariorossi",
    "github": "github.com/mariorossi"
  },
  "hard_skills": [
    {
      "title": "TypeScript",
      "level": "Avanzato",
      "description": "Sviluppo di applicazioni complesse con TypeScript"
    },
    {
      "title": "Vue.js",
      "level": "Avanzato",
      "description": "Creazione di SPA e componenti riutilizzabili"
    },
    {
      "title": "Node.js",
      "level": "Intermedio",
      "description": "Sviluppo di API RESTful"
    }
  ],
  "soft_skills": [
    {
      "title": "Comunicazione",
      "description": "Ottime capacità di comunicazione verbale e scritta"
    },
    {
      "title": "Lavoro di squadra",
      "description": "Esperienza in team agili"
    }
  ],
  "hobby": [
    {
      "title": "Fotografia",
      "description": "Fotografia paesaggistica e ritrattistica"
    },
    {
      "title": "Trekking",
      "description": "Escursioni in montagna"
    }
  ],
  "lenguages": [
    {
      "title": "Italiano",
      "level": "Madrelingua",
      "description": "Lingua nativa"
    },
    {
      "title": "Inglese",
      "level": "C1",
      "description": "Certificato IELTS 7.5"
    },
    {
      "title": "Spagnolo",
      "level": "B2",
      "description": "Certificato DELE"
    }
  ],
  "experiences": [
    {
      "period": "2021 - Presente",
      "company": "Tech Solutions S.r.l.",
      "role": "Senior Developer",
      "start_date": "2021-03-01",
      "description": "Sviluppo di applicazioni web enterprise con Vue.js e Node.js"
    },
    {
      "period": "2019 - 2021",
      "company": "Digital Agency",
      "role": "Frontend Developer",
      "start_date": "2019-06-01",
      "description": "Creazione di siti web responsive e e-commerce"
    }
  ]
}

*/