using System;
using RestSharp; // RestSharp v112.1.0
using RestSharp.Authenticators;
using System.Threading;
using System.Threading.Tasks;
namespace MailGunExamples
{
  class SendSimpleMessage
  {
    public static async Task<RestResponse> Send()
    {
        var options = new RestClientOptions("https://api.mailgun.net")
        {
            Authenticator = new HttpBasicAuthenticator("api", Environment.GetEnvironmentVariable("MAILGUN_API_KEY") ?? "your-mailgun-api-key")
        };

        var client = new RestClient(options);
        var request = new RestRequest("/v3/sandbox9d0dd225b14645a28da1c8cbc6b33618.mailgun.org/messages", Method.Post);
        request.AlwaysMultipartFormData = true;
        request.AddParameter("from", "KTG Platform <postmaster@sandbox9d0dd225b14645a28da1c8cbc6b33618.mailgun.org>");
        request.AddParameter("to", "Rene Reyes <rene.reyes.alquimi@gmail.com>");
        request.AddParameter("subject", "Hello Rene Reyes");
        request.AddParameter("text", "Congratulations Rene Reyes, you just sent an email with Mailgun! You are truly awesome!");
        return await client.ExecuteAsync(request);
    }
  }
}