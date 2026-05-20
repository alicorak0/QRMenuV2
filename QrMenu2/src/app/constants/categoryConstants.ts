export const CATEGORIES: { id: number, name: string, pathUrl: string }[] = [
  { id: 1, name: 'Burgerler', pathUrl: 'burgers' },
  { id: 2, name: 'Aperatifler', pathUrl: 'snacks' },
  { id: 3, name: 'İçecekler', pathUrl: 'drinks' },
  { id: 4, name: 'Tatlılar', pathUrl: 'desserts' },
  { id: 5, name: 'Soslar', pathUrl: 'sauces' }
];

 //export const API_BASE_URL = 'https://api-quattrocafe.nufusistatistikleri.online';
export const API_BASE_URL = 'https://localhost:44311';
export const API_ROOT_URL = `${API_BASE_URL}/api`;
export const PRODUCT_UPLOADS_BASE_URL = `${API_BASE_URL}/uploads/products`;
export const MENU_HUB_URL = `${API_BASE_URL}/menuhub`;