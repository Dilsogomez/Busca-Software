
import type { Filter, IconName } from './types';

export const FILTERS: Filter[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'ia', label: 'Ferramentas de IA' },
    { id: 'empresarial', label: 'Soluções Empresariais' },
    { id: 'gratuitos', label: 'Gratuitos' },
    { id: 'pagos', label: 'Pagos' },
    { id: 'brasileiros', label: 'Somente apps brasileiros' },
];

export const VALID_ICON_NAMES: IconName[] = [
    'erp', 'retail', 'hr', 'support', 'marketing', 'payment', 
    'finance', 'communication', 'office', 'crm', 'design', 
    'collaboration', 'project', 'video', 'ai', 'brain', 'robot', 'default'
];
