import type { Client, Modele, Tutoriel, Appointment, Order, Workstation, ManagerProfile, Fourniture } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Amina Diallo',
    phone: '+221 77 123 45 67',
    email: 'amina.d@example.com',
    measurements: {
      tour_d_encolure: 38, carrure_devant: 40, carrure_dos: 42, tour_de_poitrine: 92,
      tour_de_taille: 75, tour_sous_seins: 70, ecartement_des_seins: 18, tour_de_bassin: 100,
      longueur_poitrine: 25, longueur_sous_seins: 32, longueur_taille: 42, longueur_corsage: 45,
      longueur_manche: 58, tour_de_manche: 30, longueur_jupe: 60, longueur_pantalon: 102,
      tour_de_bras: 28, tour_de_genou: 38, tour_de_ceinture: 80, longueur_genou: 55,
      longueur_epaule: 12, hauteur_bassin: 20, longueur_de_robe: 110, tour_de_robe: 120,
      observation: 'Cliente préfère les coupes cintrées.',
    },
    lastSeen: '2 semaines'
  },
  {
    id: '2',
    name: 'Moussa Traoré',
    phone: '+223 70 98 76 54',
    email: 'm.traore@example.com',
    measurements: {
      tour_d_encolure: 42, carrure_devant: 45, carrure_dos: 46, tour_de_poitrine: 105,
      tour_de_taille: 88, tour_de_bassin: 102, longueur_corsage: 50, longueur_manche: 62,
      longueur_pantalon: 105, tour_de_bras: 34, tour_de_ceinture: 90, longueur_epaule: 15,
    },
    lastSeen: '1 mois'
  },
  {
    id: '3',
    name: 'Fatou Ndiaye',
    phone: '+221 78 876 54 32',
    email: 'fatou.ndiaye@example.com',
    measurements: {
      tour_d_encolure: 39, carrure_devant: 41, carrure_dos: 43, tour_de_poitrine: 98,
      tour_de_taille: 80, tour_sous_seins: 75, ecartement_des_seins: 19, tour_de_bassin: 108,
      longueur_poitrine: 26, longueur_sous_seins: 34, longueur_taille: 44, longueur_corsage: 47,
      longueur_manche: 59, tour_de_manche: 32, longueur_jupe: 65, longueur_de_robe: 115,
    },
    lastSeen: '3 jours'
  },
    {
    id: '4',
    name: 'Oumar Camara',
    phone: '+224 62 111 22 33',
    email: 'oumar.c@example.com',
    measurements: {
      tour_d_encolure: 41, carrure_devant: 44, carrure_dos: 45, tour_de_poitrine: 102,
      tour_de_taille: 85, tour_de_bassin: 99, longueur_corsage: 48, longueur_manche: 61,
      longueur_pantalon: 104, tour_de_bras: 33, tour_de_ceinture: 88, longueur_epaule: 14,
    },
    lastSeen: '5 jours'
  },
  {
    id: '5',
    name: 'Binta Keita',
    phone: '+225 07 555 66 77',
    email: 'binta.k@example.com',
    measurements: {},
    lastSeen: 'Nouveau'
  },
  {
    id: '6',
    name: 'Sekou Fofana',
    phone: '+226 55 44 33 22',
    email: 'sekou.f@example.com',
    measurements: {},
    lastSeen: 'Nouveau'
  }
];

export const MOCK_MODELES: Modele[] = [
  {
    id: 'm1',
    title: 'Grand Boubou "Prestige"',
    genre: 'Homme',
    event: 'Cérémonie',
    fabric: 'Bazin Riche',
    difficulty: 'Avancé',
    imageUrls: ['https://placehold.co/400x500/e2e8f0/78350f?text=Grand+Boubou'],
    description: 'Le Grand Boubou "Prestige" est une pièce maîtresse de l\'élégance masculine africaine. Réalisé en Bazin Riche de première qualité, il se distingue par ses broderies complexes et sa coupe ample, garantissant à la fois confort et majesté. Idéal pour les grandes occasions.',
    patron_pdf_link: '#'
  },
  {
    id: 'm2',
    title: 'Robe en Wax Évasée',
    genre: 'Femme',
    event: 'Quotidien',
    fabric: 'Wax Hollandais',
    difficulty: 'Intermédiaire',
    imageUrls: [
        'https://placehold.co/400x500/e2e8f0/78350f?text=Robe+Wax+1',
        'https://placehold.co/400x500/e2e8f0/78350f?text=Robe+Wax+2',
        'https://placehold.co/400x500/e2e8f0/78350f?text=Robe+Wax+3',
    ],
    description: 'Une robe vibrante et confortable pour le quotidien. Sa coupe évasée flatte toutes les silhouettes, et le tissu Wax Hollandais assure des couleurs vives et une excellente tenue. Facile à porter et à entretenir.',
  },
  {
    id: 'm3',
    title: 'Ensemble Tunique Enfant',
    genre: 'Enfant',
    event: 'Quotidien',
    fabric: 'Coton léger',
    difficulty: 'Débutant',
    imageUrls: ['https://placehold.co/400x500/e2e8f0/78350f?text=Tunique+Enfant'],
    description: 'Un adorable ensemble pour enfant, parfait pour jouer en tout confort. La tunique et le pantalon assorti sont en coton léger et respirant. Un projet idéal pour les couturiers débutants.',
    patron_pdf_link: '#'
  },
  {
    id: 'm4',
    title: 'Robe de Mariée "Divine"',
    genre: 'Femme',
    event: 'Mariage',
    fabric: 'Dentelle, Tulle, Satin',
    difficulty: 'Avancé',
    imageUrls: ['https://placehold.co/400x500/e2e8f0/78350f?text=Robe+Mariage'],
    description: 'Une robe de mariée spectaculaire qui incarne la grâce et le romantisme. Confectionnée avec une dentelle fine, du tulle vaporeux et un satin luxueux, cette pièce est rehaussée de broderies perlées à la main. Une tenue inoubliable pour le plus beau jour de votre vie.',
  },
  {
    id: 'm5',
    title: 'Chemise "Dakar" Col Mao',
    genre: 'Homme',
    event: 'Quotidien',
    fabric: 'Lin ou Coton',
    difficulty: 'Intermédiaire',
    imageUrls: [
        'https://placehold.co/400x500/e2e8f0/78350f?text=Chemise+Dakar+1',
        'https://placehold.co/400x500/e2e8f0/78350f?text=Chemise+Dakar+2'
    ],
    description: 'La chemise "Dakar" allie modernité et tradition avec son col Mao épuré et sa coupe ajustée. Confectionnée en lin ou en coton, elle est légère et agréable à porter. Un indispensable du vestiaire masculin.',
    patron_pdf_link: '#'
  },
  {
    id: 'm6',
    title: 'Jupe Crayon Pagne',
    genre: 'Femme',
    event: 'Quotidien',
    fabric: 'Pagne tissé',
    difficulty: 'Débutant',
    imageUrls: ['https://placehold.co/400x500/e2e8f0/78350f?text=Jupe+Crayon'],
    description: 'La jupe crayon en pagne tissé est un classique revisité. Elle épouse les formes avec élégance et met en valeur les motifs traditionnels du tissu. Un modèle simple à réaliser pour un effet spectaculaire.',
  }
];


export const MOCK_TUTORIELS: Tutoriel[] = [
    {
        id: 't1',
        title: 'Maîtriser la prise de mesures pour femme',
        category: 'Prise de mesures',
        duration: '25 min',
        imageUrl: 'https://placehold.co/400x225/e2e8f0/78350f?text=Prise+Mesures',
        description: 'Apprenez les techniques essentielles pour prendre des mesures précises et garantir des vêtements parfaitement ajustés.'
    },
    {
        id: 't2',
        title: 'Technique de la coupe à plat pour une jupe',
        category: 'Découpe',
        duration: '45 min',
        imageUrl: 'https://placehold.co/400x225/e2e8f0/78350f?text=Coupe+Jupe',
        description: 'Ce guide détaillé vous montrera comment créer un patron de jupe de base et le couper avec précision dans votre tissu.'
    },
    {
        id: 't3',
        title: 'Coudre une fermeture éclair invisible',
        category: 'Techniques de couture',
        duration: '30 min',
        imageUrl: 'https://placehold.co/400x225/e2e8f0/78350f?text=Fermeture+Eclair',
        description: 'Démystifiez la pose de fermetures éclair invisibles pour une finition professionnelle sur vos robes et jupes.'
    },
    {
        id: 't4',
        title: 'Prendre les mesures pour un pantalon homme',
        category: 'Prise de mesures',
        duration: '20 min',
        imageUrl: 'https://placehold.co/400x225/e2e8f0/78350f?text=Mesures+Homme',
        description: 'Un guide rapide et efficace pour prendre toutes les mesures nécessaires à la confection d\'un pantalon homme sur mesure.'
    }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    clientId: '1',
    clientName: 'Amina Diallo',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    time: '14:30',
    type: 'Essayage',
    notes: 'Essayage final de la robe de cérémonie.'
  },
  {
    id: 'a2',
    clientId: '3',
    clientName: 'Fatou Ndiaye',
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    time: '11:00',
    type: 'Livraison',
  },
  {
    id: 'a3',
    clientId: '2',
    clientName: 'Moussa Traoré',
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    time: '16:00',
    type: 'Rendez-vous',
    notes: 'Discussion pour un nouveau grand boubou.'
  },
  {
    id: 'a4',
    clientId: '5',
    clientName: 'Binta Keita',
    date: new Date().toISOString(),
    time: '10:00',
    type: 'Rendez-vous',
    notes: 'Prise de mesures pour une nouvelle robe.'
  }
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 'o1',
        clientId: '1',
        modelId: 'm4',
        date: new Date('2024-05-15').toISOString(),
        status: 'Livré',
        price: 165000,
        ticketId: 'CMD-A1B2C3',
        workstationId: 'ws1',
    },
    {
        id: 'o2',
        clientId: '2',
        modelId: 'm1',
        date: new Date('2024-06-20').toISOString(),
        status: 'Livré',
        price: 300000,
        ticketId: 'CMD-D4E5F6',
        workstationId: 'ws2',
    },
    {
        id: 'o3',
        clientId: '1',
        modelId: 'm2',
        date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        status: 'Prêt à livrer',
        notes: 'Ajustement de la longueur de la robe.',
        price: 120000,
        ticketId: 'CMD-G7H8I9',
        workstationId: 'ws1',
    },
     {
        id: 'o4',
        clientId: '3',
        modelId: 'm6',
        date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
        status: 'En finition',
        price: 80000,
        ticketId: 'CMD-J1K2L3',
        workstationId: 'ws2',
    },
    {
        id: 'o5',
        clientId: '4',
        modelId: 'm5',
        date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        status: 'En cours de couture',
        price: 65000,
        ticketId: 'CMD-M4N5P6',
        workstationId: 'ws1',
    },
    {
        id: 'o6',
        clientId: '5',
        modelId: 'm2',
        date: new Date().toISOString(),
        status: 'En attente de validation',
        price: 125000,
        ticketId: 'CMD-Q7R8S9',
    },
    {
        id: 'o7',
        clientId: '6',
        modelId: 'm1',
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        status: 'En attente de validation',
        price: 320000,
        ticketId: 'CMD-T1U2V3',
    }
];

export const MOCK_FOURNITURES: Fourniture[] = [
    {
        id: 'f1',
        nom: 'Wax Hollandais Vlisco',
        type: 'Tissu',
        fournisseur: 'Vlisco',
        quantite: 50,
        unite: 'm',
        prixAchat: 15000,
        imageUrl: 'https://placehold.co/400x225/e2e8f0/78350f?text=Wax+Vlisco'
    },
    {
        id: 'f2',
        nom: 'Fil de coton Gütterman',
        type: 'Mercerie',
        quantite: 100,
        unite: 'bobine',
        fournisseur: 'Mercerie du coin',
        prixAchat: 500,
        imageUrl: 'https://placehold.co/400x225/e2e8f0/78350f?text=Fil+Coton'
    },
    {
        id: 'f3',
        nom: 'Boutons nacrés',
        type: 'Mercerie',
        quantite: 4,
        unite: 'unité',
        prixAchat: 150,
        imageUrl: 'https://placehold.co/400x225/e2e8f0/78350f?text=Boutons'
    },
    {
        id: 'f4',
        nom: 'Bazin Riche',
        type: 'Tissu',
        quantite: 1.5,
        unite: 'm',
        imageUrl: 'https://placehold.co/400x225/e2e8f0/78350f?text=Bazin+Riche'
    }
];

export const MOCK_WORKSTATIONS: Workstation[] = [
    {
        id: 'ws1',
        name: 'Poste de Couture 1',
        accessCode: 'POSTE-A4B8',
    },
    {
        id: 'ws2',
        name: 'Atelier Broderie',
        accessCode: 'POSTE-F9C1',
    }
];

export const MOCK_MANAGER_PROFILE: ManagerProfile = {
    name: 'Atelier Adélaris',
    avatarUrl: 'https://placehold.co/100x100/e2e8f0/78350f?text=ADL',
};

export const WAITING_ROOM_ID = 'salle-commandes';