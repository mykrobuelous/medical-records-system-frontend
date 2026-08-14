// 📦 LIBRARIES IMPORT
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from '../store/store';

/* ===================================================================== */
/*🧩 PROVIDER LAYOUT - Where Providers Live*/

interface Props {
    children: ReactNode;
}

const ProviderLayout: React.FC<Props> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default ProviderLayout;
