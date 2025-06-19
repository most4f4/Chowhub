import { apiFetch } from "@/lib/api";
import { CompareSharp } from "@mui/icons-material";

export async function checkUniqueUserName(userName) {
  const res = await apiFetch(`/users/check-username/${userName}`);

  //   console.log("AVAILABLE OR NOT FROM API END POINT: ", userName, res.unique);
  return res.unique;
}
