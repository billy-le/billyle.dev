interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate = ({ name, email, message }: EmailTemplateProps) => (
  <div>
    <p>
      From: <strong>{name}</strong>
    </p>
    <p>
      Email: <a href={`mailto:${email}`}>{email}</a>
    </p>
    <br />
    <p>{message}</p>
  </div>
);
