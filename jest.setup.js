jest.mock('react-router-dom', () => {
  const actualReactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...actualReactRouterDom,
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => element,
  };
});
