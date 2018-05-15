class Index {

  hello (req, res, next) {
    res.status(200).json(
      {
        "name": "Hi There",
        "version": "1.0.0"
      }
    );
  }

}

module.exports = new Index();
