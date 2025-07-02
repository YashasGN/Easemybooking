namespace Places_Services.Models.DTO_Category
{
    public class UpdateCategory
    {
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
