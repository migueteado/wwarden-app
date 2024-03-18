interface AvatarProps {
  username: string;
}
export const Avatar = ({ username }: AvatarProps) => {
  return (
    <div className="flex items-center justify-center h-6 w-6 bg-blue-300 dark:bg-blue-500 rounded-full">
      <div>{username.charAt(0).toUpperCase()}</div>
    </div>
  );
};
