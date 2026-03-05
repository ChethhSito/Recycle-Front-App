import { useSelector } from 'react-redux';
import { translations } from '../constants/translations';

export const useTranslation = () => {
    const language = useSelector(state => state.language?.language) || 'es';
    return translations[language] || translations['es'];
};