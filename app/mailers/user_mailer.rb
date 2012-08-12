class UserMailer < ActionMailer::Base
  default :from => "Redwood Social <hi@redwoodsocial.com>"

  def welcome(user, options)
    @user = user
    @password = options[:password]

    mail(to: user.email, :subject => I18n.t("user_mailer.welcome"))
  end
end
