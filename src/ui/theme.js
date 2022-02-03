module.exports = {
  palette: {
    common: {
      black: '#000',
      white: '#fff'
    },
    primary: {
      light: '#88c0d0',
      main: '#81a1c1',
      dark: '#5e81ac'
    },
    secondary: {
      light: '#4c566a',
      // Used as main background
      main: '#3b4252',
      dark: '#2e3440'
    },
    error: {
      light: '#DE6967',
      main: '#D64441',
      dark: '#952f2d'
    },
    grey: {
      50: '#B7C5C8',
      100: '#A3B1B6',
      200: '#909EA4',
      300: '#7C8A92',
      400: '#687780',
      500: '#54636D',
      600: '#5e81ac',
      700: '#3b4252',
      800: '#2e3440',
      900: '#2e3440'
    },
    colors: {
      red: '#bf616a',
      yellow: '#ebcb8b',
      lavander: '#b48ead',
      green: '#a3be8c',
      blue: '#81a1c1',
      lightBlue: '#88c0d0',
      liberty: '#5e81ac',
      jungleGreen: '#8fbcbb',
      maximumRed: '#bf616a',
      darkYellow: '#ebcb8b',
      orange: '#d08770'
    },
    text: {
      disabled: 'rgba(255, 255, 255, 0.38)',
      hint: 'rgba(255, 255, 255, 0.38)',
      primary: '#E1E2E4',
      secondary: '#D2D4D6',
      third: '#979CA1',
      icon: '#F0F0F1'
    },
    type: 'dark'
  },
  action: {
    hover: 'rgba(255, 255, 255, 0.1)',
    selected: 'rgba(255, 255, 255, 0.2)'
  },
  duration: {
    longer: 0.3,
    main: 0.2,
    shorter: 0.1
  },
  shape: { borderRadius: '4px' },
  spacing: factor => [0, 4, 8, 16, 32, 64][factor],
  sizes: {
    width: {
      sidebar: 172
    },
    height: {
      systemNavbar: 45
    }
  }
};
