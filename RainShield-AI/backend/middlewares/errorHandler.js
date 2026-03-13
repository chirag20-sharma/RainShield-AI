// Error handler middleware
module.exports = (err, req, res, next) => {
  // Add error handling logic here
  res.status(500).send('Something went wrong!');
};