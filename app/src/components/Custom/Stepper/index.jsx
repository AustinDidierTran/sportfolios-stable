import React, { useEffect } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styles from './Stepper.module.css';
import { useTranslation } from 'react-i18next';

export default function CustomStepper(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const { t } = useTranslation();
  const { steps, next, setNext, showButtons } = props;

  const isStepOptional = step => {
    return [
      /* Include optional steps */
    ].includes(step);
  };

  const isStepDone = async () => {
    return false;
  };

  const isStepSkipped = step => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    if (next) {
      handleNext();
      setNext(!next);
    }
  });

  return (
    <div className={styles.all}>
      <div className={styles.stepper}>
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => {
            const { label } = step;
            const stepProps = {};
            const labelProps = {};

            if (isStepDone(index)) {
              // handleNext();
            }

            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography key={index} variant="caption">
                  Optional
                </Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
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
            {showButtons ? (
              <div className={styles.buttons}>
                <div className={styles.button}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="contained"
                    color="primary"
                  >
                    {t('back')}
                  </Button>
                </div>

                {isStepOptional(activeStep) && (
                  <div className={styles.button}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSkip}
                    >
                      {t('skip')}
                    </Button>
                  </div>
                )}
                <div className={styles.button}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1
                      ? t('finish')
                      : t('next')}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
