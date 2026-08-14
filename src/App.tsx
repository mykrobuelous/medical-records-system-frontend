// 📦 LIBRARIES IMPORT
import ProviderLayout from './shared/layout/ProviderLayout';
import AppLayout from './shared/layout/AppLayout';

/* ===================================================================== */
/*🧩 APP - Main App Window*/

const App = () => {
    return (
        <ProviderLayout>
            <AppLayout />
        </ProviderLayout>
    );
};

export default App;
