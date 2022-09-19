import { UnAuthenticatedError } from "../errors/index.js";

/*Also userId is string and createdBy is an object so we can't write like below we need to convert one of them.*/
const checkPermissions = (requestUser, resourceUserId) => {
  // if (requestUser.role === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnAuthenticatedError(
    "Not authorized to access this route"
  );
};

export default checkPermissions;
