// HeaderSimple.tsx
import * as S from './HeaderSimple.style';

type Link = {
  link: string;
  label: string;
};

type Props = {
  active: string;
  onChange: (label: string) => void;
};

const links: Link[] = [
  { link: '', label: 'Chatbot' },
  { link: '', label: 'Repositório' },
  { link: '', label: 'Dados' },
];

export function HeaderSimple({ active, onChange }: Props) {
  return (
    <S.Header>
      <S.Container>
        <S.Inner>
          <S.NavGroup>
            {links.map((link) => (
              <S.LinkStyled
                key={link.label}
                href="#"
                $active={active === link.label}
                onClick={(e) => {
                  e.preventDefault();
                  onChange(link.label);
                }}
              >
                {link.label}
              </S.LinkStyled>
            ))}
          </S.NavGroup>
        </S.Inner>
      </S.Container>
    </S.Header>
  );
}
