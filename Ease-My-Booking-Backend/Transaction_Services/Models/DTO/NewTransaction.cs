namespace Transaction_Services.Models.DTO
{
    public class NewTransaction
    {
        public string TransactionId { get; set; }
        public int PackageId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string ModeOfPayment { get; set; }
        public string TransactionStatus { get; set; }
        public int TicketForChildren { get; set; }
        public int TicketForAdults { get; set; }
        public int TicketForSeniorCitizen { get; set; }
        public int TicketForForeigner { get; set; }
        public int TotalTicketsPrice { get; set; }
        public DateOnly SloteDate { get; set; }
        public string SloteTime { get; set; }
        public DateTime TransactionTime { get; set; } = DateTime.Now;
    }
}
