import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styles from './Stepper.module.css';

export default function CustomStepperWithHooks(props) {
  const {
    activeStep,
    completed,
    handleBack,
    handleNext,
    steps,
  } = props;

  return (
    <div className={styles.all}>
      <div className={styles.stepper}>
        <Stepper activeStep={activeStep}>
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
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={styles.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <div className={styles.content}>
              {steps[activeStep].content}
            </div>
            <div className={styles.buttons}>
              <div className={styles.button}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="contained"
                  color="primary"
                >
                  Back
                </Button>
              </div>
              <div className={styles.button}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!completed.has(activeStep)}
                >
                  {activeStep === steps.length - 1
                    ? 'Finish'
                    : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
