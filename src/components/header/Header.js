import React from "react";
import styles from "./Header.module.scss";
import HelpIcon from "./HelpIcon";
import NavIcon from "./NavIcon";
import SettingsIcon from "./SettingsIcon";
import StatsIcon from "./StatsIcon";

const Header = (props) => {
  return (
    <div className={styles.appHeader}>
      <div className={styles.menuLeft}>
        <button className={styles.icon} type="button">
          <NavIcon />
        </button>
      </div>
      <div className={styles.title}>Geordle</div>
      <div className={styles.menuRight}>
        <button
          className={styles.icon}
          id="help"
          onClick={props.onDisplayModal}
          type="button"
        >
          <HelpIcon />
        </button>
        <button
          className={styles.icon}
          id="stats"
          onClick={props.onDisplayModal}
          type="button"
        >
          <StatsIcon />
        </button>
        <button
          className={styles.icon}
          id="settings"
          onClick={props.onDisplayModal}
          type="button"
        >
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
};
export default Header;
