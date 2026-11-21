
// import React from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Home from './components/Home';
// import Registration from './components/Registration';

// const RootApp: React.FC = () => {
//   return (
//     <SafeAreaProvider>
//       <Home />
//     </SafeAreaProvider>
//   );
// };

// export default RootApp;


import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './components/Home';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

const RootApp: React.FC = () => {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <WishlistProvider>
          <Home />
        </WishlistProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
};

export default RootApp;