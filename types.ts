export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  measurements: {
    tour_d_encolure?: number;
    carrure_devant?: number;
    carrure_dos?: number;
    tour_de_poitrine?: number;
    tour_de_taille?: number;
    tour_sous_seins?: number;
    ecartement_des_seins?: number;
    tour_de_bassin?: number;
    longueur_poitrine?: number;
    longueur_sous_seins?: number;
    longueur_taille?: number;
    longueur_corsage?: number;
    longueur_manche?: number;
    tour_de_manche?: number;
    longueur_jupe?: number;
    longueur_pantalon?: number;
    tour_de_bras?: number;
    tour_de_genou?: number;
    tour_de_ceinture?: number;
    longueur_genou?: number;
    longueur_epaule?: number;
    hauteur_bassin?: number;
    longueur_de_robe?: number;
    tour_de_robe?: number;
    observation?: string;
  };
  lastSeen: string;
}

export interface Modele {
  id: string;
  title: string;
  genre: 'Homme' | 'Femme' | 'Enfant';
  event: 'Cérémonie' | 'Quotidien' | 'Soirée' | 'Mariage';
  fabric: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  imageUrls: string[];
  description: string;
  patron_pdf_link?: string;
}

export interface Tutoriel {
  id: string;
  title:string;
  category: 'Prise de mesures' | 'Découpe' | 'Techniques de couture';
  duration: string;
  imageUrl: string;
  description: string;
}

export type AppointmentType = 'Essayage' | 'Livraison' | 'Rendez-vous' | 'Autre';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: string; // ISO string format
  time: string; // "HH:mm" format
  type: AppointmentType;
  notes?: string;
}

export type OrderStatus = 
  'En attente de validation' | 
  'En cours de couture' | 
  'En finition' | 
  'Prêt à livrer' | 
  'Livré';

export interface Order {
  id: string;
  clientId: string;
  modelId: string;
  date: string; // ISO String
  status: OrderStatus;
  ticketId: string;
  price?: number;
  notes?: string;
  workstationId?: string;
}

export interface Fourniture {
  id: string;
  nom: string;
  type: 'Tissu' | 'Mercerie' | 'Autre';
  fournisseur?: string;
  quantite: number;
  unite: 'm' | 'cm' | 'unité' | 'bobine';
  prixAchat?: number;
  imageUrl: string;
}


export type Page = 'accueil' | 'commandes' | 'catalogue' | 'tutoriels' | 'agenda' | 'modeleDuMois' | 'gestion' | 'favoris' | 'login' | 'gestionPostes' | 'gestionTutoriels' | 'dashboard' | 'clients' | 'suiviCommande' | 'salleCommandes' | 'fournitures' | 'archives';

export type UserMode = 'client' | 'manager' | 'workstation';


export interface Workstation {
    id: string;
    name: string;
    accessCode: string;
}

export interface Notification {
    id: string;
    message: string;
    date: string; // ISO String
    read: boolean;
    orderId?: string;
}

export interface ManagerProfile {
    name: string;
    avatarUrl: string;
}