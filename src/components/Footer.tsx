import { SocialLinks } from "./shared/SocialLinks";

export const Footer = () => {
  return (
    <footer className="border-t border-t-gray-400">
      <div className="p-2">
        <div className="flex">
          <SocialLinks variant="footer" className="mr-4" />
          <div className="my-auto ml-auto">by Andrew Alagna</div>
        </div>
      </div>
    </footer>
  );
};
