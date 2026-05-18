from django.db import models # On importe le models standard, plus le GIS

class Bridge(models.Model):
    """
    Représentation d'un pont dans la base de données.
    """
    bridge_id = models.CharField(
        max_length=10, 
        primary_key=True,
        help_text="Identifiant unique du pont"
    )
    name = models.CharField(
        max_length=100,
        help_text="Nom du pont"
    )
    
    # Remplacement de location par latitude et longitude
    latitude = models.FloatField(
        help_text="Latitude du pont",
        null=True, blank=True
    )
    longitude = models.FloatField(
        help_text="Longitude du pont",
        null=True, blank=True
    )

    class Meta:
        db_table = "bridges" 

    def __str__(self):
        return f"{self.bridge_id} - {self.name}"