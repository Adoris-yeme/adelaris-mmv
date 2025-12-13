
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

export type ShowcaseStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface Modele {
  id: string;
  title: string;
  genre: 'Homme' | 'Femme' | 'Enfant';
  event: 'Cérémonie' | 'Quotidien' | 'Soirée' | 'Mariage';
  category?: string;
  fabric: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  imageUrls: string[];
  description: string;
  patron_pdf_link?: string;
  atelierId: string;
  atelierName: string;
  showcaseStatus: ShowcaseStatus;
}

export interface Tutoriel {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  category: 'Prise de mesures' | 'Découpe' | 'Techniques de couture';
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
  status?: 'confirmed' | 'pending';
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

export type Page = 
  // Authenticated pages
  'accueil' | 'commandes' | 'catalogue' | 'agenda' | 'modeleDuMois' | 'gestion' | 
  'favoris' | 'gestionPostes' | 'dashboard' | 'clients' | 'suiviCommande' | 
  'salleCommandes' | 'fournitures' | 'archives' | 'finances' | 'requestAppointment' |
  'studio' | 'settings' | 'admin' | 'avisAtelier' | 'tutoriels' | 'gestionTutoriels' |
  // Public pages
  'publicHome' | 'about' | 'showroom' | 'reviews' | 'login' | 'register' | 'legal';


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
    reviewId?: string;
}

export type AtelierType = 'Atelier Couture' | 'Boutique / Showroom' | 'Grande Entreprise / Usine' | 'Indépendant (Domicile)';
export type Specialization = 'Dame' | 'Homme' | 'Enfant' | 'Mixte' | 'Broderie' | 'Accessoires';

export interface ManagerProfile {
    name: string;
    avatarUrl: string;
    atelierType?: AtelierType;
    specialization?: Specialization;
    employeeCount?: number;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: 'Loyer' | 'Électricité' | 'Matériel' | 'Salaires' | 'Marketing' | 'Autre';
    date: string; // ISO String
}

// --- SaaS Types ---

export type UserRole = 'manager' | 'superadmin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  atelierId?: string;
}

export type SubscriptionStatus = 'active' | 'inactive' | 'pending' | 'trial';
export type SubscriptionPlan = 'trial' | 'premium'; // Simplified plans

export interface AtelierData {
  clients: Client[];
  models: Modele[];
  appointments: Appointment[];
  orders: Order[];
  workstations: Workstation[];
  fournitures: Fourniture[];
  notifications: Notification[];
  expenses: Expense[];
  managerProfile: ManagerProfile;
  managerAccessCode: string;
  modelOfTheMonthId: string | null;
  favoriteIds: string[];
  isNew: boolean;
  tutoriels?: Tutoriel[];
}

export interface Atelier {
  id: string;
  name: string;
  managerId: string;
  subscription: {
    status: SubscriptionStatus;
    expiresAt: string | null; // ISO Date string
    plan: SubscriptionPlan;
  };
  data: AtelierData;
  createdAt: string; // ISO Date string
}

export interface AtelierWithManager extends Atelier {
  managerEmail: string;
}

export interface Review {
    id: string;
    author: string;
    content: string;
    rating: number;
    target: 'platform' | 'atelier';
    atelierId?: string;
    atelierName?: string;
    createdAt: string;
    response?: string;
}

// --- Site Content Types ---
export interface HomepageHero {
  imageUrl: string;
  backgroundPosition: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface HomepageSegment {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  layout: 'image-left' | 'image-right';
}

export interface HomepageStat {
    id: string;
    value: string;
    label: string;
}

export type BlockType = 'hero' | 'features' | 'content' | 'stats' | 'cta';

export interface BaseBlock {
    id: string;
    type: BlockType;
}

export interface HeroBlock extends BaseBlock {
    type: 'hero';
    title: string;
    subtitle: string;
    imageUrl: string;
    backgroundPosition?: string;
    buttonText: string;
    buttonLink: string;
}

export interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface FeaturesBlock extends BaseBlock {
    type: 'features';
    title: string;
    features: Feature[];
}

export interface StatItem {
    id: string;
    value: string;
    label: string;
}

export interface StatsBlock extends BaseBlock {
    type: 'stats';
    backgroundColor: string;
    stats: StatItem[];
}

export interface CTABlock extends BaseBlock {
    type: 'cta';
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor: string;
}

export interface ContentBlock extends BaseBlock {
    type: 'content';
    title: string;
    text: string;
    imageUrl: string;
    layout: 'image-left' | 'image-right';
}

export type PageBlock = HeroBlock | FeaturesBlock | StatsBlock | CTABlock | ContentBlock;

export interface SiteContent {
  hero: HomepageHero;
  segments: HomepageSegment[];
  stats: HomepageStat[];
  blocks: PageBlock[];
}
