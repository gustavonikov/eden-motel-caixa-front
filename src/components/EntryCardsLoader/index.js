import Shimmer from "react-shimmer-effect";

import './styles.css';

function EntryCardsLoader() {
    return (
        <div className="container">
            <Shimmer>
                <div className="card" key="1" />
                <div className="card" key="2" />
                <div className="card" key="3" />
                <div className="card" key="4" />
                <div className="card" key="5" />
                <div className="card" key="6" />
                <div className="card" key="7" />
                <div className="card" key="8" />
                <div className="card" key="9" />
                <div className="card" key="10" />
            </Shimmer>
        </div>
    );
}

export default EntryCardsLoader;
