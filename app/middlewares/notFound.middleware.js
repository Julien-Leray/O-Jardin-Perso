export const notFoundMiddleware = (req, res) => {
  res.status(404).json({ 'message': 'Ressource Not Found' });
}

