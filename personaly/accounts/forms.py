from allauth.account.forms import LoginForm, SignupForm, ResetPasswordForm
from django import forms


class LoginForm(LoginForm):
    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.fields['login'].widget = forms.TextInput(
            attrs={'type': 'email', 'class': 'uk-input uk-form-large', 'placeholder': self.fields['login'].label})
        self.fields['password'].widget = forms.PasswordInput(
            attrs={'type': 'password', 'class': 'uk-input uk-form-large', 'placeholder': self.fields['password'].label})
        self.fields['remember'].widget = forms.PasswordInput(
            attrs={'type': 'checkbox', 'class': 'uk-checkbox'})
        self.fields['remember'].initial = True


class SignupForm(SignupForm):
    def __init__(self, *args, **kwargs):
        super(SignupForm, self).__init__(*args, **kwargs)
        self.fields['email'].widget = forms.TextInput(
            attrs={'type': 'email', 'class': 'uk-input uk-form-large', 'placeholder': self.fields['email'].label})
        self.fields['password1'].widget = forms.PasswordInput(
            attrs={'type': 'password', 'class': 'uk-input uk-form-large', 'placeholder': self.fields['password1'].label})
        self.fields['password2'].widget = forms.PasswordInput(
            attrs={'type': 'password', 'class': 'uk-input uk-form-large', 'placeholder': self.fields['password2'].label})


class ResetPasswordForm(ResetPasswordForm):
    def __init__(self, *args, **kwargs):
        super(ResetPasswordForm, self).__init__(*args, **kwargs)
        self.fields['email'].widget = forms.TextInput(
            attrs={'type': 'email', 'class': 'uk-input uk-form-large', 'placeholder': self.fields['email'].label})
        self.fields['email'].label = ''
