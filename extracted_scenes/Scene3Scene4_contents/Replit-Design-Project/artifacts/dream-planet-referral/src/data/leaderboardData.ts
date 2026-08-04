import kiutRababagPhoto from "@assets/Kiut_rababag_1785838557478.jpg";
import dmith2Photo from "@assets/dmith2_1785838557478.jpg";
import queenportiaPhoto from "@assets/Queenportia_1785838557478.jpg";
import callLinsPhoto from "@assets/Call_lins_1785838557478.jpg";
import pingerzBeatPhoto from "@assets/Pingerzbeat_1785838557477.jpg";
import davidSingsPhoto from "@assets/Davidsings_1785838557478.jpg";
import diaryofmskhefPhoto from "@assets/diaryofmskhef_1785838557478.jpg";
import drEPhoto from "@assets/Profile_photo__1785838557478.jpg";

export type LeaderboardUser = {
  rank: number;
  username: string;
  initials: string;
  points: number;
  color: string;
  photo?: string;
  isCurrentUser?: boolean;
};

export const leaderboardData: LeaderboardUser[] = [
  { rank: 1, username: "kiut_Rababag", initials: "KR", points: 40, color: "bg-teal-500",   photo: kiutRababagPhoto },
  { rank: 2, username: "dmith2",       initials: "D",  points: 20, color: "bg-orange-500", photo: dmith2Photo },
  { rank: 3, username: "queenportia",  initials: "Q",  points: 20, color: "bg-purple-500", photo: queenportiaPhoto },
  { rank: 4, username: "call_lins",    initials: "C",  points: 10, color: "bg-blue-500",   photo: callLinsPhoto },
  { rank: 5, username: "eg",           initials: "E",  points: 10, color: "bg-green-500" },
  { rank: 6, username: "pingerzbeat",  initials: "P",  points: 10, color: "bg-pink-500",   photo: pingerzBeatPhoto },
  { rank: 7, username: "davidsings",   initials: "D",  points: 10, color: "bg-indigo-500", photo: davidSingsPhoto },
  { rank: 8, username: "diaryofmskhef",initials: "D",  points: 10, color: "bg-yellow-500", photo: diaryofmskhefPhoto },
  { rank: 9, username: "dr._e",        initials: "DE", points: 0,  color: "bg-red-500",    photo: drEPhoto, isCurrentUser: true }
];
