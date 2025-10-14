export const paginate = async (Model, req, filter = {}, populate = "") => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const total = await Model.countDocuments(filter);

  let query = Model.find(filter).skip(skip).limit(limit);

  const data = await query;

  return {
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    perPage: limit,
    data,
  };
};

export default paginate;