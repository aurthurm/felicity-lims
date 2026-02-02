<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-xl">
        Enter verification code
      </CardTitle>
      <CardDescription>We sent a 6-digit code to your email.</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel for="otp" class="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP id="otp" :maxlength="6" required>
              <InputOTPGroup class="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot :index="0" />
                <InputOTPSlot :index="1" />
                <InputOTPSlot :index="2" />
                <InputOTPSlot :index="3" />
                <InputOTPSlot :index="4" />
                <InputOTPSlot :index="5" />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription class="text-center">
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>
          <Button type="submit">
            Verify
          </Button>
          <FieldDescription class="text-center">
            Didn't receive the code? <a href="#">Resend</a>
          </FieldDescription>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>
