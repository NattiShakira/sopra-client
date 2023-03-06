import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import {useEffect} from "react";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {

    return (
        <div>
            <Header/>
            <AppRouter/>
        </div>
    );
};

export default App;


