using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace University_Club_Management_Backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIdCardImageUrlToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdCardImageUrl",
                table: "Users",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdCardImageUrl",
                table: "Users");
        }
    }
}
