const controller = {
  
    renderGestionPage: async (req, res) => {
      try {
        res.render('gestion');
      } catch (error) {
        res.status(500).send(error.message);
      }
    },
  };
  
  export default controller;
  