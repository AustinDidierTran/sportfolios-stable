import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styles from './Stepper.module.css';
import { useTranslation } from 'react-i18next';
import { ContainerBottomFixed } from '../../Custom';

export default function CustomStepperWithHooks(props) {
  const {
    activeStep,
    completed,
    Back,
    handleBack,
    handleNext,
    Next,
    handleReset,
    finish,
    steps,
  } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.all}>
      <div className={styles.stepper}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(step => {
            const { label } = step;
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
      <div className={styles.display}>
        {activeStep === steps.length ? (
          <div>
            <Typography className={styles.instructions}>
              {t('all_steps_completed')}
            </Typography>
            <Button onClick={handleReset} className={styles.button}>
              {t('reset')}
            </Button>
          </div>
        ) : (
          <div>
            <div className={styles.content}>
              {steps[activeStep].content}
            </div>
            <ContainerBottomFixed>
              <div className={styles.buttons}>
                <div className={styles.button}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => {
                      Back(activeStep);
                      handleBack();
                    }}
                    variant="contained"
                    color="primary"
                    style={{ color: 'white' }}
                  >
                    {t('back')}
                  </Button>
                </div>
                {finish && activeStep === steps.length - 1 ? (
                  <div className={styles.button}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={finish}
                      disabled={!completed.has(activeStep)}
                      style={{ color: 'white' }}
                    >
                      {t('finish')}
                    </Button>
                  </div>
                ) : (
                  <div className={styles.button}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        Next(activeStep);
                        handleNext();
                      }}
                      disabled={!completed.has(activeStep)}
                      style={{ color: 'white' }}
                    >
                      {activeStep === steps.length - 1
                        ? t('finish')
                        : t('next')}
                    </Button>
                  </div>
                )}
              </div>
            </ContainerBottomFixed>
          </div>
        )}
      </div>
    </div>
  );
}
