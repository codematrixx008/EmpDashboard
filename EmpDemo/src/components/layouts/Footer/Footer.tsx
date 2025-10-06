import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from '../../redux/store/store'; 
import "../../assets/styles/footer.css";
import { useTranslation } from 'react-i18next';

export default function Footer() {
 const { t } = useTranslation();
  const [languageDetails, setLanguageDetails] = useState<{ footer?: string } | null>(null);

   const {
        errorMsg
        } = useSelector((state: RootState) => ({
          errorMsg: state.error.errorMsg,
      }));

    

  return (
    <>
      <footer className="footer-container">© 2025, {t('FOOTER')} </footer>
    </>
  );
}
