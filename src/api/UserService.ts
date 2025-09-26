import {
  useUserRegistration,
  UserRegistrationData,
} from "../components/UserContext";

export const createNewAccount = async (
  UserRegistrationData: UserRegistrationData
) => {
  console.log(UserRegistrationData.firstName);
};
