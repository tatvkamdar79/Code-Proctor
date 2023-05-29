import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="p-5 text-center">
            <h1 className="mb-3">404 Page not found</h1>
            <Link to="/">Return Home</Link>
        </div>
    );
};

export default NotFound;

// "TATV VERSION"

// import React from 'react';
// import { Link } from 'react-router-dom';

// const NotFound: React.FC = () => {
//     return (
//         <div
//             style={{
//                 backgroundImage:
//                     'url("https://cdn.dribbble.com/users/1175431/screenshots/6188233/404-error-dribbble-800x600.gif")',
//                 backgroundColor: 'white',
//                 height: '100%',
//                 width: '100%',
//                 position: 'absolute',
//                 top: '0px',
//                 backgroundRepeat: 'no-repeat',
//                 backgroundSize: 'stretch',
//                 backgroundPosition: 'center',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center'
//             }}
//         >
//             <Link to="/">
//                 <h1 className="mb-3 text-danger underline-none">Looks like you got lost!</h1>
//             </Link>
//         </div>
//     );
// };

// export default NotFound;
