import {
  IconLogout,
  IconMessage,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';
import logo from '../../assets/LogoBrain.svg';
import type { Entidade } from '../../types/entidade';



interface NavbarSimpleProps {
  entidades: Entidade[];
  activeEntidade: Entidade | null;
  onSelectEntidade: (entidade: Entidade) => void;
}



function NavbarSimple({ entidades, activeEntidade, onSelectEntidade }: NavbarSimpleProps) {

  const links = entidades.map((item) => (
    <a
      className={classes.link}
      data-active={activeEntidade?.id === item.id || undefined}
      href="#"
      key={item.id}
      onClick={(event) => {
        event.preventDefault();
        onSelectEntidade(item);  
      }}
    >
      <IconMessage className={classes.linkIcon} stroke={1.5} />
      <span>{item.nome}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <div className={classes.header} >
          <img className={'Logo'} src={logo} alt="Logo" width={60} height={'auto'} />
          <h3 className={classes.h3}>Brain Analytics</h3>
        </div>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Alterar Conta</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}

export default NavbarSimple;