const React = require('react');

module.exports = {
  BrowserRouter: ({ children }) => children,
  Route: () => null,
  Routes: () => null,
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({}),
};
